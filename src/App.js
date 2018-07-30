import React, { Component } from 'react';
import firebase from './firebase.js';
import './App.css';
import Table from './components/Table'

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: '',
      email: '',
      users: [],
      formVisible: true,
      error: ''
    }
  }
  componentDidMount(){
    const usersRef = firebase.database().ref('users');
    usersRef.on('value', (snapshot) => {
      let users = snapshot.val();
      let newState = [];
      for (let user in users) {
        newState.push({
          firebaseID: user,
          id: users[user].id,
          email: users[user].email,
          user: users[user].user
        });
      }
      this.setState({
        users: newState
      });
    });
  }
  handleChange = (data) =>{
    let change = { [data.target.name] : data.target.value }
    this.setState(change)
  }
  sendUser = (e) => {
    const usersRef = firebase.database().ref('users');
    e.preventDefault();
    const max = Math.max(...this.state.users.map(item=>item.id));
    const id = this.state.users.length?max+1:0;
    const newUser = {
      id: id,
      user: this.state.user,
      email: this.state.email
    }
    usersRef.push(newUser);
    this.hideButtons('User added.');
  }
  deleteUser = (user) => {
    const usersRef = firebase.database().ref('users');
    usersRef.child(user).remove();
    this.setState({error: <span className="alert alert-danger">User deleted.</span>})
  }
  hideButtons = (error) => {
    error?this.setState({formVisible:true, error: <span className="alert alert-info">{error}</span>})
    :this.setState({formVisible:true, error: ''});   
  }
  render() {
    return (
      <section>
        <div className="container mt-4">
          {this.state.users.length<10?
            this.state.formVisible?
          <button onClick={()=>this.setState({formVisible:false,error:''})} className="btn btn-success m-4"><i className="fas fa-plus-circle mr-2"></i>Add user</button>
          :
          <div className="row">
            <div className="col-12 p-4">
            <div class="input-group mb-3">
              <input className="form-control" placeholder="Username" name="user" onChange={this.handleChange.bind(this)}/>
              <input className="form-control" placeholder="E-mail" name="email" onChange={this.handleChange.bind(this)}/>
              <button onClick={(e)=>this.sendUser(e)} className="btn btn-outline-success"><i className="fas fa-plus-circle mr-2"></i>Submit</button>
              <button onClick={()=>this.hideButtons('')} className="btn btn-outline-warning"><i className="fas fa-plus-circle mr-2"></i>Hide</button>
            </div>
            </div>
          </div>
          :<h4 className="p-4">You've reached maxium of users.</h4>
          }
          {this.state.error?this.state.error:''}

          <div className="row">
            <div className="col-12">
              <Table delete={(user)=>this.deleteUser(user)} users={this.state.users}></Table>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default App;
