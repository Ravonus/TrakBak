object = {
  uploadCategorySubImg: false,
  uploadCategoryImg: false,
  showUrl: '',
  singleObj: false,
  mainTableHead: [],
  rowNumber: 0,
  files: [],
  toastrs: {},
  tables: {},
  formUrls: {
    userLogin: {
      url: '/auth/login',
      type: 'login',
      redirect: '/'
    },
    registrationForm: {
      url: '/auth/registration',
      type: 'registration',
      redirect: '/'
    }
  },
  user: '',
  saveProfileButton: false,
  renderLoad: (rowName, keyName) => {
    function render(data, type, row) {

      if (data && typeof data === 'string') return data;

      if (row && row[rowName] && Array.isArray(row[rowName]) && row[rowName].length > 0) {

        if (row[rowName].length === 1) {

          row[rowName] = row[rowName][0][keyName];
          return row[rowName];
        }
        let newArray = '';
        row[rowName].forEach((obj, index) => {

          newArray += `${obj[keyName]}, `;

          if (index === row[rowName].length - 1) {
            newArray = newArray.slice(0, -2);
          }

        });

        return row[rowName] = newArray;

      } else if (row && row[rowName]) {

        return row[rowName] = 'None';

      } else return;

    }

    return eval(render)

  }
}