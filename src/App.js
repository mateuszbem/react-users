import React, { Component } from 'react';
import firebase from './firebase.js';
import './App.css';
import Table from './components/Table';
import _ from 'lodash';

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: '',
      email: '',
      users: [],
      formVisible: true,
      error: '',
      sorted: 'desc',
      sortedColumn: 'id',
      validated: null
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
    let change = { [data.target.name] : data.target.value, validated: null }
    this.setState(change);
  }
  sendUser = (e) => {
    const usersRef = firebase.database().ref('users');
    e.preventDefault();
    const max = Math.max(...this.state.users.map(item=>item.id));
    const id = this.state.users.length?max+1:1;
    if(this.state.user!==''||this.state.email!==''){
      let userValid = this.state.user.match(/^[a-zA-Z0-9]{2,20}$/);
      let emailValid = this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      if(userValid===null){
        this.setState({ validated: 'Insert correct username.'})
      }
      else if(emailValid===null){
        this.setState({ validated: 'Wrong e-mail.'})
      }
      else if(_.filter(this.state.users,{email:this.state.email}).length>0)
        this.setState({ validated: 'User already exists.'})
      else{
        const newUser = {
          id: id,
          user: this.state.user,
          email: this.state.email
        }
        usersRef.push(newUser);
        this.hideButtons('User added.');
        this.clearFields();
      }
    }
    else{
      this.setState({ validated: "Input's can't be blank."})
    }
  }
  deleteUser = (user) => {
    const usersRef = firebase.database().ref('users');
    usersRef.child(user).remove();
    this.hideButtons();
    this.setState({error: <span className="alert alert-danger p-1">User deleted.</span>, validated: null})
  }
  hideButtons = (error) => {
    error?this.setState({formVisible:true, validated: null,error: <span className="alert alert-info p-2">{error}</span>})
    :this.setState({formVisible:true, validated: null, error: ''});   
  }
  clearFields = () => {
    this.setState({
      user: '',
      email: '',
      validated: null
    })
  }
  sortTable = (data) => {
    this.state.sorted==='asc'?this.setState({
      users: _.orderBy(this.state.users, data,'desc'),
      sorted: 'desc'
    }):this.setState({
      users: _.orderBy(this.state.users, data,'asc'),
      sorted: 'asc'
    })
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
            <div className="input-group mb-3">
              <input autoFocus className="form-control" placeholder="Username" name="user" onChange={this.handleChange.bind(this)} value={this.state.user}/>
              <input className="form-control" placeholder="E-mail" name="email" onChange={this.handleChange.bind(this)} value={this.state.email}/>
              <button onClick={(e)=>this.sendUser(e)} className="btn btn-outline-success mr-1"><i className="fas fa-plus-circle mr-2"></i>Submit</button>
              <button onClick={()=>this.hideButtons('')} className="btn btn-outline-warning mr-1"><i className="fas fa-minus-circle mr-2"></i>Hide</button>
              {this.state.user||this.state.email?<button onClick={this.clearFields.bind(this)} className="btn btn-outline-info mr-1"><i className="fas fa-ban mr-2"></i>Reset fields</button>
              :null}
            </div>
            {this.state.validated?<span className="alert alert-danger p-2">{this.state.validated}</span>:''}
            </div>
          </div>
          :<h4 className="p-4">You've reached maxium of users.</h4>
          }
          {this.state.error?this.state.error:''}

          <div className="row">
            <div className="col-12">
              <Table delete={(user)=>this.deleteUser(user)} users={this.state.users} sort={(e)=>this.sortTable(e)} sorted={this.state.sorted}></Table>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default App;
