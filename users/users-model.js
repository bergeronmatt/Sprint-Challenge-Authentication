const db = require('../database/dbConfig.js');

function find(){
    return db('users').select('id', 'username', 'password');
}

function findBy(filter){
    return db('users').where(filter);
}

async function add (user) {
    const [id] = await db('users').insert(user, 'id');
    return findBy(id);
}

function findById(id){
    return db('users').where({id}).first();
}

module.exports = {
    findById,
    find,
    findBy,
    add
}