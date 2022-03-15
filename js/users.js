window.addEventListener('load', () => {
    
    const app = Vue.createApp({
        data() {
            return {
                users: [],
                user: {
                    id: '',
                    name: '',
                    username: '',
                    email: '',
                    address: '',
                },
                operation: 'Register'
            }
        },
        created() {
            if (localStorage.getItem('vue3.users') !== null){
                this.users = JSON.parse(localStorage.getItem('vue3.users'));
            } else {
                this.listUsers();
            }
        },
        mounted() {
            this.$refs.name.focus();
        },
        methods: {
            listUsers: async function () {
                const res = await fetch('https://jsonplaceholder.typicode.com/users');
                const data = await res.json();
                this.users = data.slice(0,5);
                this.updateLocalStorage();
            },
            updateLocalStorage: function(){
                localStorage.setItem('vue3.users', JSON.stringify(this.users));
            },
            processUser: function (event) {
                event.preventDefault();
                if(this.operation==='Register'){
                    this.users.push({
                        id: this.users.reduce((h,v) => h = h > v.id ? h : v.id, 0) + 1,
                        name: this.user.name,
                        username: this.user.username,
                        email: this.user.email,
                        address: this.user.address,
                    });

                } else{
                    this.users[this.userIndex].name = this.user.name;
                    this.users[this.userIndex].username = this.user.username;
                    this.users[this.userIndex].email = this.user.email;
                    this.users[this.userIndex].address = this.user.address;
                }
                
                this.updateLocalStorage();
                this.clearFields();
            },
            editUser(id){
                this.operation = 'update';
                const userFound = this.users.find((user, index)=>{
                    this.userIndex = index;
                    return user.id === id;
                });
                this.user.name = userFound.name;
                this.user.username = userFound.username;
                this.user.email = userFound.email;
                this.user.address = userFound.address;
                this.updateLocalStorage();
            },
            deleteUser: function(id, event){
                const confirmation = confirm('Do you want to delete the user?');
                if(confirmation){
                    this.users = this.users.filter(user=>user.id!==id);
                    this.updateLocalStorage();
                } else{
                    event.preventDefault();
                }
            },
            clearFields: function(){
                this.user.id = '',
                this.user.name = '',
                this.user.username = '',
                this.user.email = '',
                this.user.address = '',
                this.operation = 'Register';
                this.$refs.name.focus();
            }

        }
    });

    app.mount('#app');

});