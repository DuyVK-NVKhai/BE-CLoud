import express from "express"
import UserRouter from "./routes/user"
import cors from "cors"
import ThingRouter from "./routes/thing"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/user", UserRouter)
app.use("/api/thing", ThingRouter)

export {app}