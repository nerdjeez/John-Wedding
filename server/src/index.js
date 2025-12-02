import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { PrismaClient } from "@prisma/client";

// Inisialisasi Database
const db = new PrismaClient();

const app = new Elysia()
  // 1. Setup CORS
  .use(cors())

  // 2. Route Cek Server
  .get("/", () => ({ message: "Backend John Wedding is Ready! 💍" }))

  // --- API USER ---

  // 3. REGISTER USER
  .post("/api/register", async ({ body, set }) => {
    const { name, email, password } = body;
    if (!name || !email || !password) {
      set.status = 400;
      return { success: false, message: "Data tidak lengkap!" };
    }
    try {
      const exists = await db.user.findUnique({ where: { email } });
      if (exists) {
        set.status = 400;
        return { success: false, message: "Email sudah terdaftar!" };
      }
      const hashedPassword = await Bun.password.hash(password);
      const newUser = await db.user.create({
        data: { name, email, password: hashedPassword }
      });
      return { success: true, message: "Register Berhasil!", data: { id: newUser.id, name: newUser.name } };
    } catch (error) {
      console.error("Reg Error:", error);
      set.status = 500;
      return { success: false, message: "Server Error" };
    }
  })

  // 4. LOGIN USER
  .post("/api/login", async ({ body, set }) => {
    const { email, password } = body;
    try {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        set.status = 401;
        return { success: false, message: "Email tidak ditemukan" };
      }
      const isMatch = await Bun.password.verify(password, user.password);
      if (!isMatch) {
        set.status = 401;
        return { success: false, message: "Password salah" };
      }
      return {
        success: true,
        message: "Login Berhasil",
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      };
    } catch (error) {
      console.error("Login Error:", error);
      set.status = 500;
      return { success: false, message: "Server Error" };
    }
  })

  // 5. GET PACKAGES
  .get("/api/packages", async () => {
    try {
      const packages = await db.package.findMany();
      return { success: true, data: packages };
    } catch (error) {
      return { success: false, error: "Gagal mengambil data paket" };
    }
  })

  // 6. CREATE ORDER (Checkout)
  .post("/api/orders", async ({ body, set }) => {
    const { userId, items, total } = body;
    if (!userId || !items || items.length === 0) {
      set.status = 400;
      return { success: false, message: "Data pesanan kosong!" };
    }
    try {
      const newOrder = await db.order.create({
        data: {
          userId: userId,
          totalPrice: parseFloat(total),
          status: "pending",
          items: {
            create: items.map((item) => ({
              packageId: item.packageId,
              price: parseFloat(item.price),
              extras: JSON.stringify(item.extras || {})
            }))
          }
        }
      });
      return { success: true, message: "Pesanan Diterima!", orderId: newOrder.id };
    } catch (error) {
      console.error("Order Error:", error);
      set.status = 500;
      return { success: false, message: "Gagal memproses pesanan" };
    }
  })

  // --- API ADMIN ---

  // 7. GET ALL ORDERS (Dashboard)
  .get("/api/admin/orders", async ({ query, set }) => {
    const requestingUserId = parseInt(query.userId);
    if (!requestingUserId) { set.status = 401; return { success: false, message: "Unauthorized" }; }

    const user = await db.user.findUnique({ where: { id: requestingUserId } });
    if (!user || user.role !== "admin") {
      set.status = 403;
      return { success: false, message: "Akses Ditolak! Anda bukan Admin." };
    }

    try {
      const allOrders = await db.order.findMany({
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { package: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, data: allOrders };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal mengambil data admin" };
    }
  })

  // 8. UPDATE STATUS ORDER (TERIMA)
  .patch("/api/admin/orders/:id/status", async ({ params, query, body, set }) => {
    const adminId = parseInt(query.userId);
    const orderId = parseInt(params.id);
    const { status } = body;

    if (!adminId) { set.status = 401; return { success: false, message: "Unauthorized" }; }
    
    const adminUser = await db.user.findUnique({ where: { id: adminId } });
    if (!adminUser || adminUser.role !== "admin") {
      set.status = 403; return { success: false, message: "Bukan Admin!" };
    }

    try {
      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: { status: status }
      });
      return { success: true, message: "Status berhasil diperbarui!", data: updatedOrder };
    } catch (error) {
      console.error(error);
      set.status = 500;
      return { success: false, message: "Gagal update order." };
    }
  })

  // 9. DELETE ORDER (TOLAK & HAPUS)
  .delete("/api/admin/orders/:id", async ({ params, query, set }) => {
    const adminId = parseInt(query.userId);
    const orderId = parseInt(params.id);

    if (!adminId) { set.status = 401; return { success: false, message: "Unauthorized" }; }
    
    const adminUser = await db.user.findUnique({ where: { id: adminId } });
    if (!adminUser || adminUser.role !== "admin") {
      set.status = 403; return { success: false, message: "Bukan Admin!" };
    }

    try {
      
      await db.orderItem.deleteMany({ where: { orderId: orderId } });
      
      await db.order.delete({ where: { id: orderId } });

      return { success: true, message: "Pesanan berhasil dihapus permanen!" };
    } catch (error) {
      console.error(error);
      set.status = 500;
      return { success: false, message: "Gagal menghapus data." };
    }
  })

  .listen(3000);

console.log(
  `🦊 Server John Wedding berjalan di http://${app.server?.hostname}:${app.server?.port}`
);