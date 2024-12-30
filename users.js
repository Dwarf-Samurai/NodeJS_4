const fs = require("fs");
const path = require("path");

class UsersDB {
    pathToFile = path.join(__dirname, "users.json");

    /**
     * Во время создания класса проверяем наличие файла и записываем данные из файла
     * в this.userData
     * Если файла не существует, создаем его
     */
    constructor() {
        this.usersData = { id: 0, users: [] };
        try {
            this.usersData = JSON.parse(fs.readFileSync(this.pathToFile, "utf-8"));
        } catch (err) {
            if (err.code === "ENOENT") {
                fs.writeFileSync(this.pathToFile, JSON.stringify(this.usersData));
            } else {
                throw err;
            }
        }
    }

    // Возвращает всех пользователей
    getAll() {
        return this.usersData.users;
    }

    // Возвращает пользователя по идентификатору
    getUserById(id) {
        return this.usersData.users.find((user) => user.id === id);
    }

    // Создает пользователя
    createUser(userData) {
        this.usersData.id += 1;
        this.usersData.users.push({...userData, id: this.usersData.id });
        this.#save();
        return this.usersData.id;
    }

    // Обновляет пользователя
    updateUser(id, userData) {
        const user = this.getUserById(id);
        if (!user) {
            return;
        }

        Object.assign(user, userData);

        this.#save();

        return user;
    }

    // Удаляет пользователя по идентификатору
    deleteUserById(id) {
        const user = this.getUserById(id);
        if (!user) {
            return;
        }

        const userIndex = this.usersData.users.indexOf(user);
        this.usersData.users.splice(userIndex, 1);

        this.#save();

        return user;
    }

    // Метод сохраняет всю информацию по пользователям в файл
    #save() {
        fs.writeFileSync(this.pathToFile, JSON.stringify(this.usersData, null, 2));
    }
}

module.exports = { UsersDB };