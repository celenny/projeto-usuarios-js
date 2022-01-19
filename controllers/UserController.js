class UserController {
      constructor(formId, tableId) {
          this.formEl = document.getElementById(formId); // element form
          this.tableEl = document.getElementById(tableId); // element table 

          this.onSubmit();
          this.onEdit();
      } // constructor

      onEdit() {
          document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e => {
                this.showPanelCreate();
          });
      } // onEdit

      onSubmit() {
        // metod p/ enviar formulario
      
        this.formEl.addEventListener('submit', event => {

            event.preventDefault();

            let btn = this.formEl.querySelector('[type=submit]');

            btn.disabled = true; // desabilitar o botão

            let values = this.getValues();

            if (!values) return false;

            this.getPhoto().then(
                (content) => {
                  values.photo = content; // conteudo do arquivo photo
                  this.addLine(values);
                  this.formEl.reset(); // resetar o formulário 
                  btn.disabled = false;
              }, 
                (e) => {
                  console.error(e); // 
              });
          });
      } // onSubmit

      getPhoto() {

          return new Promise((resolve, reject) => {
              let fileReader = new FileReader();

              let elements = [...this.formEl.elements].filter(item => {
                  if (item.name === 'photo') {
                      return item;
                  }
              });
    
              let file = elements[0].files[0];
    
              fileReader.onload = () => {
                  resolve(fileReader.result);
              };

              fileReader.onerror = (e) =>  {
                  reject(e);
              };
    
              if (file) {
                fileReader.readAsDataURL(file);
              } else {
                resolve('dist/img/padrao-avatar.png');
              }
            });


      } // getPhoto

      getValues() {
        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach(function(field){

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.name) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (field.name == 'gender') {
      
              if (field.checked) {
                  user[field.name] = field.value;
              }
              
            } else if (field.name == 'admin') {
                user[field.name] = field.checked;

            } else {
              user[field.name] = field.value;
            }
      
          });

          if (!isValid) {
            return false;
          }
      
          return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

      } // getValues

      addLine(dataUser) {
          
          let tr = document.createElement('tr');
          tr.dataset.user = JSON.stringify(dataUser);

          tr.innerHTML = `
              <td>
              <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
              <td>${dataUser.name}</td>
              <td>${dataUser.email}</td>
              <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
              <td>${Utils.dateFormat(dataUser.register)}</td>
              <td>
                  <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                  <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
              </td>`;

          tr.querySelector('.btn-edit').addEventListener('click', e=> {
              console.log(JSON.parse(tr.dataset.user));
              this.showPanelUpdate();
          });

          this.tableEl.appendChild(tr);
          
          this.updateCount();
      } // addLine

      showPanelCreate() {
        // mostrar painel de usuários
        document.querySelector('#box-user-create').style.display = "block";
        document.querySelector('#box-user-update').style.display = "none";
      }

      showPanelUpdate() {
        // mostrar painel de editar usuarios
        document.querySelector('#box-user-create').style.display = "none";
        document.querySelector('#box-user-update').style.display = "block";
      }

      updateCount() {
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {
            numberUsers ++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;

        });
        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;
      } // update count
} // class UserController