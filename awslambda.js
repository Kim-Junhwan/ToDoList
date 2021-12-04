const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

const todoSchema = mongoose.Schema({
    googleLoginId : {
        type : String,
        required : true
    },
    id : {
        type : Number,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required: true
    }
},{
    versionKey : false
});

let connection = null;
const connect = () => {
    if (connection && mongoose.connection.readyState === 1) {
        return Promise.resolve(connection);
    }else{
        return mongoose.connect(MONGODB_URI, {useNewUrlParser : true})
        .then(
            conn => {
                connection = conn;
                return connection;
            });
    }
};

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let todo = mongoose.model('board', todoSchema);
    let proxy, password;
    switch (operation) {
        case 'POST':
            let lastId = 0;
            connect().then(()=>
            todo.findOne({})
            .sort({id : -1})
            .exec(function(err, board){
                if(err){
                    callback(null, {
                        'statusCode': 500,
                        'body':err
                    });
                }else{
                    lastId = board ? board.id : 0;
                    const { content , googleLoginId} = 
                    JSON.parse(event.body);
                    const newtodo = new todo({
                        content,
                        googleLoginId
                    });
                    newtodo.date = new Date();
                    newtodo.id = lastId+1;
                    newtodo.save(function(err, board){
                    if(err){
                    callback(null, {
                        'statusCode': 500,
                        'body':err
                    });
                }else{
                    callback(null, {
                        'statusCode': 200,
                        'headers' : {'Access-Control-Allow-Origin': '*'},
                        'body' : JSON.stringify(lastId+1)
                    });
                }
                    })
                }
            })
            );
            break;
        case 'GET':
            if(event.pathParameters === null){
                let query = {};
                if (event.queryStringParameters !== null) {
                    if(event.queryStringParameters.name){
                    query.name = {
                        $regex:event.queryStringParameters.name,
                        $option:'i'
                    };
                }
                if(event.queryStringParameters.name){
                    query.name = {
                        $regex:event.queryStringParameters.content,
                        $option:'i'
                    };
                }
                }
                connect().then(() => {
                    todo.find(query)
                    .sort({id : 1})
                    .exec(function(err, boards){
                         if(err){
                    callback(null, {
                        'statusCode': 500,
                        'body':err
                    });
                }else{
                    callback(null, {
                        'statusCode': 200,
                        'headers' : {'Access-Control-Allow-Origin': '*'},
                        'body' : JSON.stringify(boards)
                    });
                }
                    })
                });
            }
            else{
                proxy = event.pathParameters.proxy;
                 connect().then(() => {
                    todo.find({googleLoginId: proxy})
                    .exec(function(err, board){
                         if(err){
                    callback(null, {
                        'statusCode': 500,
                        'body':err
                    });
                }
                else if(!board){
                    callback(null, {
                        'statusCode': 500,
                        'body':JSON.stringify("TODO NOT FOUND")
                    });
                }
                else{
                    callback(null, {
                        'statusCode': 200,
                        'headers' : {'Access-Control-Allow-Origin': '*'},
                        'body' : JSON.stringify(board)
                    });
                }
                    })
                });
            }
            break;
        case 'PUT':
            proxy = event.pathParameters.proxy;
             connect().then(() => {
                    todo.findOne({id:proxy})
                    .exec(function(err, board){
                         if(err){
                    callback(null, {
                        'statusCode': 500,
                        'body':err
                    });
                }else if(!board){
                    callback(null, {
                        'statusCode': 500,
                        'body':JSON.stringify("todo not found.")
                    });
                }
                else{
                     const { content } = 
                    JSON.parse(event.body);
                    todo.findOneAndUpdate({id:proxy},
                    {content}
                    ).exec(function(err, board){
                    if(err){
                    callback(null, {
                        'statusCode': 500,
                        'body':err
                    });
                }else{
                    callback(null, {
                        'statusCode': 200,
                        'body' : JSON.stringify('Success')
                    });
                }
                    })
                }
                    })
                });
            break;
        case 'DELETE':
            proxy = event.pathParameters.proxy;
            connect().then(() => {
                    todo.findOne({id:proxy})
                    .exec(function(err, board){
                         if(err){
                    callback(null, {
                        'statusCode': 500,
                        'body':err
                    });
                }else if(!board){
                    callback(null, {
                        'statusCode': 500,
                        'body':JSON.stringify("todo not found.")
                    });
                }
                else{
                     
                    todo.findOneAndRemove({id:proxy}
                    ).exec(function(err, board){
                    if(err){
                    callback(null, {
                        'statusCode': 500,
                        'body':err
                    });
                }else{
                    callback(null, {
                        'statusCode': 200,
                        'headers' : {'Access-Control-Allow-Origin': '*'},
                        'body' : JSON.stringify('Remove Success')
                    });
                }
                    })
                }
                    })
                });
                break;
        default:
            callback(new Error(`Operation Error: "${operation}"`))
    }
};
