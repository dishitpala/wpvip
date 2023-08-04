import Utils from '../utils.js';
import shell from 'shelljs';
import replace from 'replace-in-file';
import fs from 'fs';
import path from 'node:path';

class Init {

    constructor() {
        this.wordpress = Utils.getWordPressPath()
        this.github    = Utils.getGitHubURL()
    }

    run() {

        fs.access(path.join( this.wordpress, 'wp-admin' ), ( error ) => {
            if ( error ) {
                // Directory does not exist.
                Utils.log( 'Not WordPress installation.', 'error' )
            } else {

                // Directory exists.
                Utils.spinner( 'Deleting wp-content directory if exists!' );
                this.deleteExistingWPContent( () => {
                    Utils.stopSpinner( 'Deleted existing wp-content directory.' )

                    Utils.spinner( 'Cloning ' + this.github );
                    this.cloneRepository( () => {
                        Utils.stopSpinner( 'Cloned ' + this.github )

                        Utils.spinner( 'Cloning git@github.com:Automattic/vip-go-mu-plugins.git to "wp-content/mu-plugins" recursively' );
                        this.cloneMUPlugins( () => {
                            Utils.stopSpinner( 'Cloned git@github.com:Automattic/vip-go-mu-plugins.git' )

                            Utils.spinner( 'Updating "wp-config.php" file!' );
                            this.updateWPConfig()
                            Utils.stopSpinner( 'Updated "wp-config.php" file!' )
                        } )
                    } )
                } )
            }
        })

    }

    deleteExistingWPContent( callback ) {
        shell.exec("rm -rf wp-content", { silent: true, async: true }, callback)
    }

    cloneRepository( callback ) {
        const destination = '"' + path.join( this.wordpress, 'wp-content' ) + '"'
        shell.exec('git clone ' + this.github + ' ' + destination, { silent: true, async: true }, callback)
    }

    cloneMUPlugins( callback ) {
        const destination = '"' + path.join( path.join( this.wordpress, 'wp-content' ), 'mu-plugins' ) + '"'
        shell.exec('git clone git@github.com:Automattic/vip-go-mu-plugins.git ' + destination + ' --recursive', { silent: true, async: true }, callback)
    }

    updateWPConfig() {

        const file = path.join( this.wordpress, 'wp-config.php' )
        const backup = path.join( this.wordpress, 'wp-config-' + Utils.getDate() + '.php' )
        fs.copyFile( file, backup, (err) => {} )

        const from = '/* Add any custom values between this line and the "stop editing" line. */';
        const to = "/* Add any custom values between this line and the \"stop editing\" line. */ \n\n" +
            "// Load early dependencies \n" +
            "if ( file_exists( __DIR__ . '/wp-content/mu-plugins/000-pre-vip-config/requires.php' ) ) {\n" +
            "    require_once __DIR__ . '/wp-content/mu-plugins/000-pre-vip-config/requires.php';\n" +
            "}\n" +
            "// Loading the VIP config file\n" +
            "if ( file_exists( __DIR__ . '/wp-content/vip-config/vip-config.php' ) ) {\n" +
            "    require_once __DIR__ . '/wp-content/vip-config/vip-config.php';\n" +
            "}\n\n" +
            "// Defining constant settings for file permissions and auto-updates\n" +
            "define( 'DISALLOW_FILE_EDIT', true );\n" +
            "define( 'DISALLOW_FILE_MODS', true );\n" +
            "define( 'AUTOMATIC_UPDATER_DISABLED', true );\n"

        replace.sync({
            files: file,
            from: from,
            to: to,
            isRegex: false
        });

    }

}

export default Init
