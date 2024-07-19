export default {
    development: {
        keyJWT: 'abcdhf6$$%dojkhfˆ(sdkjhf',
        ldap_url: 'ldap://10.232.48.5:389',
        db_host: "localhost",
        db_port: "5432",
        db_user: "postgres",
        db_password: "123456",
        db_database: "sijur2",
        bcryptSalts: 10,
        expiresJWT: 7200
    },   
    homologacao: {
        keyJWT: 'abcdhf6$$%dojkhfˆ(sdkjhf',
        ldap_url: 'ldap://172.16.38.168:389',
        db_host: "172.16.54.22",
        db_port: "5432",
        db_user: "sijur",
        db_password: "cf214b5d19d4d35bd249a892b2979b27",
        db_database: "sijur",
        bcryptSalts: 10,
        expiresJWT: 6000
    },
    production: {
        keyJWT: 'abcdhf6$$%dojkhfˆ(sdkjhf',
        ldap_url: 'ldap://10.232.16.18:389',
        db_host: "172.16.54.32",
        db_port: "5432",
        db_user: "sijur",
        db_password: "cf214b5d19d4d35bd249a892b2979b27",
        db_database: "sijur",
        bcryptSalts: 10,
        expiresJWT: 6000
    },
}