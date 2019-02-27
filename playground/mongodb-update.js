const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongdoDB Server')

    //findOneAndUpdate
    const db = client.db('TodoApp')
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5c76970f0f592c2d45c2627f')
    // }, {
    //     $set: {completed: true}
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result)
    // }, (err) => {
    //     console.log('Failed to fetch docs')  
    // })
    db.collection('Users').findOneAndUpdate({
        name: 'Joshua'
    }, {
            $set: { name: 'Josh' },
            $inc: {age: -1}
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result)
        }, (err) => {
            console.log('Failed to fetch docs')
        })
    // client.close()
})