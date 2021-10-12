<template>
    <v-data-table
        :headers="headers"
        :items="registered"
        sort-by="nome"
        class="elevation-1"
    >
        <template v-slot:top>
        <v-toolbar
            flat
        >
            <v-toolbar-title>Alunos Cadastrados</v-toolbar-title>
            <v-divider
                class="mx-4"
                inset
                vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
                v-model="dialog"
                max-width="500px"
            >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                >
                    Cadastrar Aluno
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                <v-container>
                    <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.nome"
                        label="Nome"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.ra"
                        type="number"
                        label="RA"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.cpf"
                        type="number"
                        label="CPF"
                        ></v-text-field>
                    </v-col>
                    
                    </v-row>
                </v-container>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                >
                    Cancelar
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                >
                    Salvar
                    <!-- <v-alert dense dismissible type="success">Aluno Cadastrado</v-alert> -->
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">Você tem certeza que deseja excluir esse Aluno?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">Confirmar</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
            mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
            mdi-delete
        </v-icon>
        </template>
        <template v-slot:no-data>
        <v-btn
            color="primary"
            @click="initialize"
        >
            Reset
        </v-btn>
        </template>
    </v-data-table>
    </template>

    <script>

    import axios from 'axios'

    export default {
        data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            {
            text: 'Registro Acadêmico',
            align: 'start',
            sortable: false,
            value: 'ra',
            },
            { text: 'nome', value: 'nome' },
            { text: 'CPF', value: 'cpf' },
            { text: 'Ações', value: 'actions', sortable: false },
        ],
        registered: [],
        editedIndex: -1,
        editedItem: {
            nome: '',
            email: '',
        },
        defaultItem: {
            ra: '',
            nome: '',
            cpf: '',
            email: '',
        },
        }),
        mounted() {
        axios.get("http://localhost:3000/alunos")
        .then((response) => { 
            this.registered = response.data.alunos
        })
        .catch(function(error) { this.error = error })
        .finally(function () { this.pending = false });
    },
        computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Novo Aluno' : 'Editar Aluno'
        },
        },
        watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
        },
        created () {
        this.initialize()
        },
        methods: {
        editItem (item) {
            this.editedIndex = this.registered.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            this.editedIndex = this.registered.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm () {
            this.registered.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close () {
            this.dialog = false
            this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            })
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            })
        },

        save () {
            if (this.editedIndex > -1) {
            Object.assign(this.registered[this.editedIndex], this.editedItem)
            } else {
            axios({
                method: "POST",
                url: "http://localhost:3000/alunos/new",
                data: {
                    nome: this.editedItem.nome,
                    email: this.editedItem.email,
                    ra: this.editedItem.ra,
                    cpf: this.editedItem.cpf
                }
            });
            this.registered.push(this.editedItem)
                    }
                    this.close()
            },
        },
    }
</script>