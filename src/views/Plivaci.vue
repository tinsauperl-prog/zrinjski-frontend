<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-5 mt-5">Plivači</h1>
        
        <v-btn color="primary" class="mb-4" @click="otvoriDodavanje">
          Dodaj novog plivača
        </v-btn>

        <v-table class="elevation-1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Godina Rođenja</th> <th>Grupa</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plivac in plivaci" :key="plivac.id">
              <td>{{ plivac.id }}</td>
              <td>{{ plivac.ime }}</td>
              <td>{{ plivac.prezime }}</td>
              <td>{{ plivac.godina_rodenja }}</td> <td>{{ nadiImeGrupe(plivac.grupa_id) }}</td>
              <td>
                <v-btn color="warning" size="small" class="mr-2" @click="pripremiUredivanje(plivac)">Uredi</v-btn>
                <v-btn color="error" size="small" @click="pripremiBrisanje(plivac.id)">Obriši</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ isEditing ? 'Uredi Plivača' : 'Novi Plivač' }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field v-model="formaPlivac.ime" label="Ime" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field v-model="formaPlivac.prezime" label="Prezime" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field v-model="formaPlivac.godina_rodenja" label="God. Rođenja" type="number" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="formaPlivac.grupa_id"
                      :items="grupe"
                      item-title="naziv"
                      item-value="id"
                      label="Odaberi grupu"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="zatvoriDialog">Odustani</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="spremiPlivaca">Spremi</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBrisanje" max-width="400px">
          <v-card>
            <v-card-title class="text-h6">Potvrda brisanja</v-card-title>
            <v-card-text>Jeste li sigurni da želite obrisati ovog plivača?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="dialogBrisanje = false">Odustani</v-btn>
              <v-btn color="error" variant="text" @click="obrisiPlivaca">Obriši</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const plivaci = ref([])
const grupe = ref([]) 

const dialog = ref(false)
const dialogBrisanje = ref(false)
const isEditing = ref(false)
const idZaBrisanje = ref(null)

// NOVO: Dodana godina_rodenja u formu
const formaPlivac = ref({ id: null, ime: '', prezime: '', godina_rodenja: null, grupa_id: null })

const dohvatiPlivace = async () => {
  const res = await fetch('http://127.0.0.1:5000/api/plivaci')
  plivaci.value = await res.json()
}

const dohvatiGrupe = async () => {
  const res = await fetch('http://127.0.0.1:5000/api/grupe')
  grupe.value = await res.json()
}

const nadiImeGrupe = (id) => {
  const g = grupe.value.find(x => x.id === id)
  return g ? g.naziv : 'Nema grupe'
}

const otvoriDodavanje = () => {
  isEditing.value = false
  formaPlivac.value = { id: null, ime: '', prezime: '', godina_rodenja: null, grupa_id: null }
  dialog.value = true
}

const pripremiUredivanje = (plivac) => {
  isEditing.value = true
  formaPlivac.value = { ...plivac }
  dialog.value = true
}

const spremiPlivaca = async () => {
  const metoda = isEditing.value ? 'PUT' : 'POST'
  const url = isEditing.value 
    ? `http://127.0.0.1:5000/api/plivaci/${formaPlivac.value.id}` 
    : 'http://127.0.0.1:5000/api/plivaci'

  await fetch(url, {
    method: metoda,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formaPlivac.value)
  })
  
  zatvoriDialog()
  dohvatiPlivace()
}

const zatvoriDialog = () => { dialog.value = false }

const pripremiBrisanje = (id) => {
  idZaBrisanje.value = id
  dialogBrisanje.value = true
}

const obrisiPlivaca = async () => {
  await fetch(`http://127.0.0.1:5000/api/plivaci/${idZaBrisanje.value}`, { method: 'DELETE' })
  dialogBrisanje.value = false
  dohvatiPlivace()
}

onMounted(() => {
  dohvatiGrupe().then(() => dohvatiPlivace())
})
</script>