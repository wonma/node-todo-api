const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongdoDB Server')

    const db = client.db('TodoApp')
    db.collection('Users').findOneAndDelete({name: 'Wonmi'}).then((result) => {
        console.log(result)
    }, (err) => {
        console.log('Failed to fetch docs')
    })

    // db.collection('Users').find({ name: 'Wonmi' }).toArray().then((docs) => {
    //     console.log(docs)
    // }, (err) => {
    //     console.log('Failed to fetch docs')
    // })

    // client.close()
})