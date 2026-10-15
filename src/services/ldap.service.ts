import jwt, { SignOptions } from "jsonwebtoken";
import { getConnection } from "../config/database";
import { LoginDTO, UsuarioAutorizado, LdapConfigStatus } from "../types/ldap";

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "8h") as SignOptions["expiresIn"];

export async function autenticarUsuario(credenciales: LoginDTO): Promise<{ token: string; usuario: UsuarioAutorizado } | null> {
    const { user, pass } = credenciales;

    if (!user || !pass) {
        throw new Error("Usuario y contraseña son requeridos");
    }

    // Validación contra BD SAGI
    const pool = await getConnection();
    const result = await pool
        .request()
        .input("UsuarioWindows", user)
        .execute<UsuarioAutorizado>("SAGI_proc_Usuario_ValidarAutorizacion");

    const usuario = result.recordset?.[0];

    if (!usuario || !usuario.Activo) {
        return null;
    }

    // Generar JWT
    const payload = {
        user: usuario.UsuarioWindows || user,
        nombre: usuario.NombreCompleto,
        correo: usuario.Correo,
        rol: usuario.Rol
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { token, usuario };
}

export async function obtenerUsuariosAutorizados(): Promise<UsuarioAutorizado[]> {
    const pool = await getConnection();
    const result = await pool
        .request()
        .execute<UsuarioAutorizado>("SAGI_proc_UsuariosAutorizados_Listar");

    return result.recordset;
}

export function verificarConfiguracion(): LdapConfigStatus {
    return {
        urlConfigurada: Boolean(process.env.LDAP_URL),
        baseDnConfigurado: Boolean(process.env.LDAP_BASE_DN),
        dominioConfigurado: Boolean(process.env.LDAP_DOMAIN)
    };
}