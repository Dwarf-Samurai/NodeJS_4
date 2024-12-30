const express = require('express');
const { articleScheme, idScheme } = require('./validation/scheme'); //
const { checkParams, checkBody } = require('./validation/validator'); //

const app = express();

let uniqueID = 0;
const articles = [];

app.use(express.json());

//Получить все статьи
app.get('/articles', (req, res) => {
    res.send({ articles });
});

// Получить конкретную статью по ид
app.get('/articles/:id', checkParams(idScheme), (req, res) => {
    const article = articles.find((article) => article.id === Number(req.params.id));
    if (article) {
        res.send({ article });
    } else {
        res.status(404);
        res.send({ article: null });
    }
});

// Создание статьи
app.post('/articles', checkBody(articleScheme), (req, res) => {
    uniqueID += 1;

    articles.push({
        id: uniqueID,
        ...req.body
    });

    res.send({
        id: uniqueID,
    });
});

// Обновление статьи
app.put('/articles/:id', checkParams(idScheme), checkBody(articleScheme), (req, res) => {
    const article = articles.find((article) => article.id === Number(req.params.id));
    if (article) {
        article.title = req.body.title;
        article.content = req.body.content;
        res.send({ article });
    } else {
        res.status(404);
        res.send({ article: null });
    }
});

// Удаление статьи
app.delete('/articles/:id', checkParams(idScheme), (req, res) => {
    const article = articles.find((article) => article.id === Number(req.params.id));
    if (article) {
        const articleIndex = articles.indexOf(article);
        articles.splice(articleIndex, 1);

        res.send({ article });
    } else {
        res.status(404);
        res.send({ article: null });
    }
});

// Не найден не один обработчик выше
app.use((req, res) => {
    res.status(404).send({
        message: "URL not found!"
    });
});

app.listen(3000);