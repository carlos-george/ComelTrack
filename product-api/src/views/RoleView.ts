
import Role from '../entities/Role';

export default {
    render(role: Role) {
        return {
            id: role.id,
            name: role.name
        };
    },
    renderMany(roles: Role[]) {
        return roles.map(role => this.render(role));
    }
}