const db = requrie('../database/dbConfig.js');

function findUser(){
    return db('users').select('id', 'username', 'password');
}

function findUserBy(filter){
    return db('users').where(filter);
}

async function add (user) {
    const [id] = await db('users').insert(user, 'id');
    return findUserBy(id);
}

function findById(id){
    return db('users').where({id}).first();
}

module.exports = {
    findById,
    findUser,
    findUser,
    add
}