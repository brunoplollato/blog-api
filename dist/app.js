"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = __importDefault(require("./prisma/client")); // importing the prisma instance we created.
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
app.post("/users", async (req, res) => {
    try {
        const { name, games } = req.body.data;
        // games is an array of string | string[]
        const newUser = await client_1.default.user.create({
            data: {
                name,
                games: {
                    // create or connect means if the game existed, we will use the old one
                    // if not, we will create a new game
                    connectOrCreate: games.map((game) => ({
                        where: {
                            name: game,
                        },
                        create: {
                            name: game,
                        },
                    })),
                },
            },
        });
        res.json(newUser);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
app.get("/users", async (req, res) => {
    try {
        const users = await client_1.default.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
app.get("/users", async (req, res) => {
    try {
        const users = await client_1.default.user.findMany({
            include: {
                games: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
app.put("/users/:id", async (req, res) => {
    try {
        const { name, games } = req.body.data;
        const { id } = req.params;
        const updatedUser = await client_1.default.user.update({
            where: {
                id,
            },
            data: {
                name,
                games: {
                    connectOrCreate: games.map((game) => ({
                        where: { name: game },
                        create: { name: game },
                    })),
                },
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await client_1.default.user.delete({
            where: {
                id,
            },
        });
        res.json(deletedUser);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
