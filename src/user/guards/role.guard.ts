/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../shared/enums/role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ])

        if (!requiredRoles) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user

        return matchRoles(requiredRoles, user?.role)
    }
}

function matchRoles(requiredRoles: string[], userRoles: string[]) {
    return requiredRoles.some((role: string) => userRoles.includes(role))
}