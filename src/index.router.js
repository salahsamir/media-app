import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import { commentRouter } from './modules/comment/controller_router.js'
import { postRouter } from './modules/post/post_router.js'

import userRouter from './modules/user/user.router.js'
import { globalError } from './utils/errorHandling.js'

const initApp = (app, express) => {
    app.use(express.json({}))
    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use(`/post`,postRouter )
    app.use(`/comment`,commentRouter )



app.use(globalError)
    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    connectDB()

}



export default initApp