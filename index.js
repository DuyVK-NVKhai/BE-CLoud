import {app} from './src/app.js'
import config from './src/configs/key.js';

app.listen(config.port, () => {
    console.log(`Server is start on 127.0.0.1:${config.port}`);
});