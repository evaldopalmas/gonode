'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')


class ForgotPasswordController {
    async store({ request, response }) {

        try {
            const email = request.input('email')
            const user = await User.findByOrFail('email', email)

            user.token = crypto.randomBytes(10).toString('hex')
            user.token_created_at = new Date()

            await user.save()

            await Mail.send(
                ['emails.forgot_password'], {
                    email,
                    token: user.token,
                    link: `${request.input('redirect_url')}?token=${user.token}`
                },
                message => {
                    message
                        .to(user.email)
                        .from('evaldopalmas@gmail.com', 'Evaldo | API')
                        .subject('Recuperação de Senha!!')
                }
            )

        } catch (error) {
            return response.status(error.status).send({
                err: { message: 'Algo não deu certo, esse email existe?' }
            })
        }


    }
    async update({ request, response }) {
        try {
            const { token, password } = request.all()
            const user = await User.findByOrFail('token', token)

            //Utiliza o
            const tokenExpired = moment()
                .subtract('2', 'days')
                .isAfter(User.token_created_at)

            if (tokenExpired) {
                return response.status(401).send({
                    err: { message: 'O token de recuperação está expirado!' }
                })
            }

            user.token = null
            user.token_created_at = null
            user.password = password

            await user.save()

        } catch (error) {
            return response.status(error.status).send({
                err: { message: 'Algo errado ao resetar sua senha!' }
            })
        }
    }
}

module.exports = ForgotPasswordController
