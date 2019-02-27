const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongdoDB Server')
    
    const db = client.db('TodoApp')

    db.collection('Todos').insertOne({
        text:'Something to do',
        completed: false
    }, (err, result) => {
        if(err) {
            return console.log('Failed to insert todo', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
        // ops: 모든 document다 갖고있음
    })

    // db.collection('Users').insertOne({
    //     name: 'Wonmi',
    //     age: 32,
    //     location: 'Seoul'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Failed to insert user', err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })

    client.close()
})