import yargs from "yargs";
import ora from 'ora';
import logSymbols from 'log-symbols';


const argv = yargs(process.argv)

let spinnerObject = null;

const Utils = {

    getArgv() {
        return argv.argv;
    },

    getWordPressPath() {
        return this.getArgv().hasOwnProperty( 'wordpress' ) ? this.getArgv().wordpress : process.cwd();
    },

    getGitHubURL() {

        if ( this.isCommand( 'init' ) ) {
            return this.getArgv()._[3]
        }

        return false;
    },

    isCommand( command ) {
        if ( command === this.getArgv()._[2] ) {
            return true;
        }

        return false;
    },

    log( message, type = 'success' ) {
        console.log(logSymbols[type], message);
    },

    spinner( message ) {
        spinnerObject = ora({
            discardStdin: false,
            text: message,
            color: 'yellow',
            spinner: 'moon'
        }).start();
    },

    stopSpinner( message, type='success' ) {
        spinnerObject.stopAndPersist({
            prefixText: '',
            suffixText: '',
            symbol: logSymbols[type],
            text: message,
        });
    },

    getDate() {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        return `${day}-${month}-${year}`;
    }
}

export default Utils;