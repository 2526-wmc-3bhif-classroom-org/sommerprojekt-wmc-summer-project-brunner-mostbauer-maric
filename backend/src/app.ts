import express from "express";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Unit, ensureSampleDataInserted } from "./unit.js";
import { schoolRouter } from "./schools/school_router.js";
import { userRouter } from "./users/user_router.js";
import { authRouter } from "./auth/auth_router.js";
import { programRouter } from "./programs/program_router.js";
import { kmLogRouter } from "./kmlog/km_router.js";
import { taskRouter } from "./tasks/task_router.js";
import { ratingRouter } from "./ratings/rating_router.js";
import { eventRouter } from "./events/event_router.js";
import { enrollmentRouter } from "./enrollments/enrollment_router.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import cors from "cors";
import fs from "fs";
import path from "path";
import { geocodeSchoolsBackground } from "./schools/school_geocoder.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Driving School API",
      version: "1.0.0",
      description: "API for managing driving schools and enrollments",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();
export { app };

// Configure CORS to accept requests from GitHub Pages and localhost
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://2526-wmc-3bhif-classroom-org.github.io',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message: "Invalid JSON provided" } });
    return;
  }
  next();
});

// hardcoded quick login for swagger
const customJsStr = `
window.addEventListener('load', () => {
  const interval = setInterval(() => {
    const authWrapper = document.querySelector('.auth-wrapper');
    if (authWrapper && !document.getElementById('dev-login-btn')) {
      const btn = document.createElement('button');
      btn.id = 'dev-login-btn';
      btn.className = 'btn authorize unlocked';
      btn.style.marginRight = '10px';
      btn.style.backgroundColor = '#4990e2';
      btn.style.borderColor = '#4990e2';
      btn.style.color = '#fff';
      btn.innerHTML = '<span>Dev Login</span>';
      btn.onclick = async () => {
        try {
          btn.innerHTML = '<span>Logging in...</span>';
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@admin.com', password: 'admin' })
          });
          const data = await response.json();
          if (data.accessToken) {
            window.ui.authActions.authorize({
              bearerAuth: {
                name: 'bearerAuth',
                schema: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                value: data.accessToken
              }
            });
            btn.innerHTML = '<span>Logged In</span>';
            setTimeout(() => btn.innerHTML = '<span>Dev Login</span>', 2000);
          } else {
            alert('Login failed: ' + (data.error?.message || 'Unknown error'));
            btn.innerHTML = '<span>Dev Login</span>';
          }
        } catch(e) {
          console.error(e);
          alert('Login error');
          btn.innerHTML = '<span>Dev Login</span>';
        }
      };
      authWrapper.prepend(btn);
    }
  }, 500);
});
`;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customJsStr }));

// Ensure avatars directory exists
const avatarsDir = path.join(process.cwd(), "avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Serve static files for avatars
app.use("/avatars", express.static(avatarsDir));

if (process.env.NODE_ENV !== "test") {
  try {
    const unit = new Unit(false);
    const result = ensureSampleDataInserted(unit);
    unit.complete(true);
    console.log(`Sample data status: ${result}`);
    geocodeSchoolsBackground();
  } catch (err) {
    console.error("Failed to ensure sample data:", err);
  }
} else {
  try {
    const unit = new Unit(false);
    ensureSampleDataInserted(unit);
    unit.complete(true);
  } catch (err: any) {
    // Ignore test mode initialization errors - tests will handle their own setup
    console.debug("Test mode initialization note:", err.message);
  }
}

app.use("/api/schools", schoolRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/programs", programRouter);
app.use("/api/kmlog", kmLogRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/events", eventRouter);
app.use("/api/enrollments", enrollmentRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(StatusCodes.OK);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Backend running on: http://0.0.0.0:" + PORT);
  });
}
