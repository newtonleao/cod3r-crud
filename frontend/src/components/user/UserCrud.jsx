import React, {Component} from 'react'
import Main from '../template/Main'
import Axios from 'axios'

const headerProps = {
    icon: 'users',
    title: 'Users',
    subTitle:'Cadastro de usuários: Incluir, Listar, Alterar e Excluir'
}

const baseURL = 'http://localhost:3001/user'
const initialState = {
    user:{ name: '', email: ''},
    list:[]
}

export default class UserCrud extends Component {
    
    state = {...initialState}

    componentWillMount(){

        Axios(baseURL).then(resp => {
            this.setState({list: resp.data})
        })
    }

    clear(){
        this.setState({user: initialState.user})        
    }

    save(){
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseURL}/${user.id}` : baseURL
        Axios[method](url, user)
            .then(resp => {
                const list = this.getUpdateList(resp.data)
                this.setState({user: initialState, list})
            })
    }

    updateField(event){
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        this.setState({user})
    }

    getUpdateList(user){
        const list = this.state.list.filter(u => u.id !== user.id)
        list.unshift(user)
        return list
    }

    renderForm(){
        return (
        <div className="form">
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label >Nome</label>
                        <input type="text" className="form-control"
                        name="name"
                        value={this.state.user.name}
                        onChange={e => this.updateField(e)}
                        placeholder="Digite o nome..." />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label >E-mail</label>
                        <input type="text" className="form-control"
                        name="email"
                        value={this.state.user.email}
                        onChange={e => this.updateField(e)}
                        placeholder="Digite o E-mail..." />
                    </div>
                </div>
            </div>

            <hr />
            <div className="row">
                <div className="col-12 d-flex justify-content-end">
                    <button className="btn btn-primary"
                        onClick={e => this.save(e)}>
                        Salvar
                    </button>
                    
                    <button className="btn btn-secondary ml-2"
                        onClick={e => this.clear(e)}>
                        Cancelar
                    </button>


                </div>
            </div>
        </div>
        )
    }

    load(user){
        this.setState({user})
    }

    remove(user){
        Axios.delete(`${baseURL}/${user.id}`).then(resp =>{
            const list = this.state.list.filter(u => u !== user)
            this.setState({list})
        })
    }

    renderTable(){
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows(){
        return this.state.list.map(user => {
                return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(user)}
                        >
                            <i className="fa fa-pencil"/>
                        </button>
                        
                        <button className="btn btn-ranger ml-2"
                        onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"/>
                        </button>
                    </td>
                </tr>
                )
            })
    }

    render(){
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}
