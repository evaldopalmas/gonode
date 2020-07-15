'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

/*User*/
Route.post('users', 'UserController.store').validator(['User'])
Route.post('sessions', 'SessionController.store').validator(['Session'])
Route.post('passwords', 'ForgotPasswordController.store')
    .validator(['ForgotPassword'])
Route.put('passwords', 'ForgotPasswordController.update')
    .validator(['ResetPassword'])
Route.get('files/:id', 'FileController.show')


/*Route group auth*/
Route.group(() => {
    /*File Uploads*/
    Route.post('files', 'FileController.store')

    /*Projects*/
    Route.resource('projects', 'ProjectController')
        .apiOnly()
        .validator(new Map(
            [
                [
                    ['projects.store'],
                    ['Project']
                ]
            ]
        ))
    Route.resource('projects.tasks', 'TaskController')
        .apiOnly()
        .validator(new Map(
            [
                [
                    ['projects.tasks.store'],
                    ['Task']
                ]
            ]
        ))

}).middleware(['auth'])
