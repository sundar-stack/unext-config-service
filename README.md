## ESLint and ESLint + Git pre-commit integration

Please follow the below steps to install and configure ESLint in the project root directories.
Please read the comments before install and get back to me for any doubts.
Do restart VSCode after installation of the packages

ESLint - Steps to get an understanding. 
------------------------------------------
* The files are already there in the commit. No need to do anything. 
* Just run `npm install` to install the dependencies

* Follow the steps below only if you miss anything after install the packages.
------
1. `npm install eslint --save-dev`
2. `eslint --init or npx eslint --init`
3. The above step will create a file **.eslintrc.json**
4. Add the necessary rules in the **rules** section of the file.

After the above steps, restart VS Code. After that it will show error/warning lines based on the rule violations.


ESLint + Git pre-commit integration
Note: I have excluded .husky folder in .gitignore. So please run `npx husky-init` to create.
------------------------------------
1. `npm i -D husky lint-staged`
2. `npx husky-init`
3. The above command will create a **.husky** folder at the root. open the file **.husky/pre-commit**
4. Replace the line `npm test` with `npx lint-staged`
5. Open **package.json** from root directory and add the below property

      ```
      "lint-staged": {
        "*.ts": "eslint"
      }
      ```

6. This will check the staged ts extension files for rule violations 
7. Make some changes to ts files, stage them and commit. It will prevent the commit if some validation are failed


Note: Please enable "Format on Save" option in VS Code. So it will format the code automatically when we save the file. 
 
