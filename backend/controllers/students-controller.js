const mysql = require('../mysql').pool

exports.getAlunos = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query (
            'SELECT * FROM cadastroalunos;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    alunos: result.map(aluno => {
                        return {
                                id_cadastro: aluno.id_cadastro,
                                nome: aluno.nome,
                                email: aluno.email,
                                ra: aluno.RA,
                                cpf: aluno.CPF
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
}

exports.postAluno = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        conn.query('INSERT INTO cadastroalunos (nome, email, ra, cpf) VALUES (?,?,?,?)',
        [req.body.nome, req.body.email, req.body.ra, req.body.cpf],
        (error, result, field) => {
            if (error) { return res.status(500).send({ error : error })}
                return res.status(200).send({
                    nome: "Aluno cadastrado com sucesso!"
                })
            })
    })
}

exports.getUmAluno = (req, res, next) =>{   
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query (
            'SELECT * FROM alunos WHERE id_aluno = ?;',
            [req.params.id_aluno],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length == 0) {
                    return res.status(404).send({
                        message: 'Não foi encontrado aluno com este ID'
                    })
                }
                const response = {
                    aluno : {
                        id_aluno: result[0].id_aluno,
                        id_cadastro: result[0].id_cadastro,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os alunos',
                            url: 'http//localhost:3000/alunos'
                        }
                    }
                }
                return res.status(200).send({ response: result })
            }
        )
    })
}

exports.deleteAluno = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM alunos WHERE id_aluno = ?`, [req.body.id_aluno],
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }  
                const response = {
                    message: 'Aluno excluído com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um aluno',
                        url: 'http://localhost:3000/alunos',
                        body: {
                            id_cadastro: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
}