import User from '../entities/User';
import UsersRoles from './UsersRolesView';

export default {
    render(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            usersroles: UsersRoles.renderMany(user.usersroles)
        };
    },
    renderMany(users: User[]) {
        return users.map(user => this.render(user));
    }
}