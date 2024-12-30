const express = require("express");
const Joi = require("joi");
const { UsersDB } = require("./users");

const usersDB = new UsersDB();

const app = express();

// Обработчик маршрута для пути "/"
app.get("/", (req, res) => {
    res.send("Welcome to the users API!");
});

const userSchema = Joi.object({
    firstName: Joi.string().min(1).required(),
    secondName: Joi.string().min(1).required(),
    age: Joi.number().min(0).max(150).required(),
    city: Joi.string().min(1),
});

function validate(schema) {
    return (req, res, next) => {
        const result = schema.validate(req.body);
        if (result.error) {
            return res.status(400).send({ error: result.error.details });
        }
        next();
    };
}

app.use(express.json());

app.get("/users", (req, res) => {
    const users = usersDB.getAll();

    res.send({ users });
});

app.post("/users", validate(userSchema), (req, res) => {
    const id = usersDB.createUser(req.body);
    res.send({ id });
});

app.put("/users/:id", validate(userSchema), (req, res) => {
    const user = usersDB.updateUser(Number(req.params.id), req.body);

    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.get("/users/:id", (req, res) => {
    const user = usersDB.getUserById(Number(req.params.id));

    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.delete("/users/:id", (req, res) => {
    const user = usersDB.deleteUserById(Number(req.params.id));

    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.listen(3000);