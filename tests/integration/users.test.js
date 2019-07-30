process.env.NODE_ENV = 'test';

const app = require('../../app');
const User = require('../../api/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const user = {
    name: 'test',
    email: 'test@test.com',
    password: 'testZ345test-'
};

describe('Users', () => {
    beforeEach(done => {
        User.remove({}, err => {
            done();
        });
    });
    describe('GET users', () => {
        it('Should get empty users list', done => {
            chai.request(app).
            get('/users').
            end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('count').eql(0);
                res.body.should.have.property('users').be.a('array');
                done();
            });
        });
        it('Should get users list', done => {
            chai.request(app).
            post('/auth/register').
            send(user).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                Object.keys(res.body).length.should.eql(1);
                res.body.should.have.property('message');
                chai.request(app).
                get('/users').
                end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(1);
                    res.body.should.have.property('users').be.a('array');
                    res.body.users[0].should.have.property('_id');
                    res.body.users[0].should.have.property('name').eql(user.name);
                    res.body.users[0].should.have.property('email').eql(user.email);
                    res.body.users[0].should.have.property('registered');
                    res.body.users[0].should.have.property('updated');
                    done();
                });
            });
        });
    });
    describe('GET/:id user', () => {
        it('Should get user details', done => {
            chai.request(app).
            post('/auth/register').
            send(user).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                Object.keys(res.body).length.should.eql(1);
                res.body.should.have.property('message');
                chai.request(app).
                get('/users').
                end((err, list) => {
                    chai.request(app).
                    get('/users/' + list.body.users[0]._id).
                    end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id').eql(list.body.users[0]._id);
                        res.body.should.have.property('name').eql(user.name);
                        res.body.should.have.property('email').eql(user.email);
                        res.body.should.have.property('registered');
                        res.body.should.have.property('updated');
                        done();
                    });
                });
            });
        });
    });
    describe('DELETE/:id user', () => {
        it('Should delete user by the given id', done => {
            chai.request(app).
            post('/auth/register').
            send(user).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                Object.keys(res.body).length.should.eql(1);
                res.body.should.have.property('message');
                chai.request(app).
                get('/users').
                end((err, res) => {
                    chai.request(app).
                    post('/auth/login').
                    send(user).
                    end((err, logged) => {
                        logged.should.have.status(200);
                        logged.body.should.be.a('object');
                        logged.body.should.have.property('message').eql('Auth successful');
                        logged.body.should.have.property('token');
                        chai.request(app).
                        delete('/users/' + res.body.users[0]._id).
                        set('Authorization', 'Bearer ' + logged.body.token).
                        end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message').eql('User deleted successfully');
                            chai.request(app).
                            get('/users').
                            end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('count').eql(0);
                                res.body.should.have.property('users').be.a('array');
                                res.body.users.should.be.empty;
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});