import { index, layout, prefix, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("auth", [
    route("login", "routes/auth/login.tsx"),
  ]),
  ...prefix("admin", [
    layout("./layouts/admin.layout.tsx", [
      route("dashboard", "routes/admin/dashboard.view.tsx"),
      route("branch", "routes/admin/branch/branch.view.tsx"),
      route("inscription", "routes/admin/inscription/inscription.view.tsx"),
      route("booking", "routes/admin/booking/booking.view.tsx"),
      route("role", "routes/admin/role/role.view.tsx"),
      route("room", "routes/admin/room/room.view.tsx"),
      route("specialty", "routes/admin/specialty/specialty.view.tsx"),
      route("staff", "routes/admin/staff/staff.view.tsx"),
      route("student", "routes/admin/student/student.view.tsx"),
      route("teacher", "routes/admin/teacher/teacher.view.tsx"),
      route("tutor", "routes/admin/tutor/tutor.view.tsx"),
      route("payment", "routes/admin/payment/payment.view.tsx"),
      ...prefix("report",[
        route("inscription", "routes/admin/report/report-inscription.view.tsx"),
        route("debt", "routes/admin/report/report-debt.view.tsx"),
      ]),
      
    ]),
  ]),

] satisfies RouteConfig;
