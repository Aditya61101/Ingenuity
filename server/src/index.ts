import express,{ Request, Response, Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
//routes
import aiRoutes from "./routes/features.route";
import paymentRoute from "./routes/stripe.route";
import webHookRoute from "./routes/webhook.route";

const app:Express = express();
const PORT=process.env.PORT||8000;

// express raw route
app.use("/stripe", webHookRoute);

//middlewares
app.use(express.json());
app.use(cors());

app.get("/", (_: Request, res: Response) => {
    res.send("Ingenuity api is running!");
});

//routes using json
app.use("/api", aiRoutes);
app.use("/stripe", paymentRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});