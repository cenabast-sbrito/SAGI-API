export interface LoginDTO {
    user: string;
    pass: string;
}

export interface UsuarioAutorizado {
    UsuarioWindows?: string;
    NombreCompleto?: string;
    Correo?: string;
    Rol?: string;
    Activo?: boolean;
    [key: string]: unknown;
}

export interface LdapConfigStatus {
    urlConfigurada: boolean;
    baseDnConfigurado: boolean;
    dominioConfigurado: boolean;
}