import React, {Component} from 'react';
import './Table.css';

class Table extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const users = this.props.users;
    console.log(users)
      return(
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">LP</th>
                <th scope="col">USER</th>
                <th scope="col">E-MAIL</th>
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
              }):<tbody><div className="loader mt-5 ml-5"></div></tbody>
              }
            </tbody>
          </table>
      )
  }
}
export default Table;