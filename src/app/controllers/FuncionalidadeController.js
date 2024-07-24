// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import Funcionalidade from '../models/Funcionalidade';

class FuncionalidadeController {
    async index(req, res) {
        const funcionalidades = await Funcionalidade.findAll();

        return res.json(funcionalidades);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });

        const funcionalidadeExist = await Funcionalidade.findOne({
            where: { name: req.body.name },
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        if (funcionalidadeExist) {
            return res
                .status(400)
                .json({ error: 'Funcionalidade já existe. ' });
        }

        const { id, name } = await Funcionalidade.create(req.body);

        return res.json({
            id,
            name,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const funcionalidade = await Funcionalidade.findByPk(req.params.id);

        // Verifica se o funcionalidade já existe na base de dados

        const funcionalidadeExist = await Funcionalidade.findOne({
            where: { name: req.body.name },
        });

        if (funcionalidadeExist) {
            return res
                .status(400)
                .json({ error: 'Funcionalidade já existe. ' });
        }

        const { id, name } = await funcionalidade.update(req.body);
        return res.json({
            id,
            name,
        });
    }

    async searchById(req, res) {
        const { id } = req.params;

        const funcionalidade = await Funcionalidade.findByPk(id);

        if (!funcionalidade) {
            return res
                .status(400)
                .json({ error: 'Funcionalidade não existe. ' });
        }

        return res.json(funcionalidade);
    }

    async delete(req, res) {
        const { id } = req.params;

        const funcionalidade = await Funcionalidade.findByPk(id);

        if (!funcionalidade) {
            return res
                .status(400)
                .json({ error: 'Funcionalidade não existe. ' });
        }

        await funcionalidade.destroy();
        return res.status(200).send();
    }
}

export default new FuncionalidadeController();
