import React, {Component} from 'react';
import './Table.css';

export class Table extends Component{
  constructor(props){
    super(props)
    this.state = {
      sorted: this.props.sorted
    }
  }
  render(){
    const users = this.props.users;
      return(
          <table className="table table-striped">
            <thead>
              <tr>
                <th onClick={()=>this.props.sort('id')} scope="col"><i className="fas fa-sort-up p-2"></i>LP</th>
                <th onClick={()=>this.props.sort('user')} scope="col">USER</th>
                <th onClick={()=>this.props.sort('email')} scope="col">E-MAIL</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {users.length>0?users.map((user,key)=>{
                return (<tr key={key}>
                  <th scope="row">{user.id}</th>
                  <td>{user.user}</td>
                  <td>{user.email}</td>
                  <td><i onClick={()=>this.props.delete(user.firebaseID)} className="fas fa-times"></i></td>
                </tr>)
              }):<tr><td className="ml-4"colSpan="4">No users.</td></tr>
              }
            </tbody>
          </table>
      )
  }
}