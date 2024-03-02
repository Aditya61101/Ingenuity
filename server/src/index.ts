import express,{ Request, Response, Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/conversation";
import cors from "cors";

const app:Express = express();
const PORT=process.env.PORT||8000;


app.use(express.json());
app.use(cors());

app.get("/", (_: Request, res: Response) => {
    res.send("Ingenuity api is running!");
});

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});