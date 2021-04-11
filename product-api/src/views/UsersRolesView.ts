import UsersRoles from '../entities/UsersRoles';
import RoleView from './RoleView';

export default {
    render(userrole: UsersRoles) {
        return {
            // id: userrole.id,
            role: RoleView.render(userrole.role)
        };
    },
    renderMany(usersroles: UsersRoles[]) {
        return usersroles.map(userrole => this.render(userrole));
    }
}