// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';
import * as admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import ldapConfig from '../../config/ldap';
import User from '../models/User';

const { authenticate } = require('ldap-authentication');

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        // Verificando se esse email existe
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Usuário não existe. ' });
        }

        // Verificar se a senha não bate

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Senha incorreta. ' });
        }

        const { id, name, whatsapp } = user;

        return res.json({
            user: {
                id,
                name,
                email,
                whatsapp,
            },
            token: jwt.sign({ id, user }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }

    async storeFab(req, res) {
        try {
            const ldapOptions = {
                ldapOpts: {
                    url: ldapConfig.development.ldap_url,
                },
                adminDn: 'uid=sistema-gapan,ou=sistema,dc=fab,dc=intraer',
                adminPassword: '#C3ntr0o3sTE$',
                userPassword: req.body.password || '',
                userSearchBase: 'ou=contas,dc=fab,dc=intraer',
                usernameAttribute: 'uid',
                username: req.body.email || '',
            };

            let ldapUser;
            try {
                ldapUser = await authenticate(ldapOptions);
            } catch (ldapError) {
                // Handle LDAP authentication error (if needed)
                ldapUser = null;
            }

            if (!ldapUser) {
                const userLocal = await User.findOne({
                    where: { email: req.body.email },
                });

                if (
                    !userLocal ||
                    !(await userLocal.checkPassword(req.body.password))
                ) {
                    return res
                        .status(401)
                        .json({ error: 'Credenciais inválidas. ' });
                }

                const { id, name, email, whatsapp } = userLocal;

                return res.json({
                    user: {
                        id,
                        name,
                        email,
                        whatsapp,
                    },
                    token: jwt.sign(
                        { id, user: userLocal },
                        authConfig.secret,
                        {
                            expiresIn: authConfig.expiresIn,
                        }
                    ),
                });
            }

            const { mail, displayName } = ldapUser;
            let user = await User.findOne({ where: { email: mail } });

            if (!user) {
                user = await User.create({
                    name: displayName,
                    email: mail,
                    password: req.body.password,
                    profile_id: 1,
                });
            }

            const hashMatches = await bcrypt.compare(
                req.body.password,
                user.password_hash
            );

            if (!hashMatches) {
                await user.update({ password: req.body.password });
            }

            const { id, name, email, whatsapp, profile_id } = user;

            return res.json({
                user: {
                    id,
                    name,
                    email,
                    whatsapp,
                    profile_id,
                },
                token: jwt.sign({ id, user }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                }),
            });
        } catch (error) {
            console.error('Erro na verificação do token:', error);
            return res
                .status(401)
                .json({ message: 'Token inválido', erro: error });
        }
    }

    async storeGoogle(req, res) {
        const { idToken } = req.params;

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);

            const { email } = decodedToken;

            // Verificando se esse email existe
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ error: 'Usuário não existe. ' });
            }

            const { id, name, whatsapp } = user;

            return res.json({
                user: {
                    id,
                    name,
                    email,
                    whatsapp,
                },
                token: jwt.sign({ id, user }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                }),
            });
        } catch (error) {
            // O token é inválido ou ocorreu um erro na verificação.
            console.error('Erro na verificação do token:', error);
            return res.status(401).json({ message: 'Token inválido' });
        }
    }
}

export default new SessionController();
