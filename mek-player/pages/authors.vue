<template>
    <h1>Szerzők</h1>
    <BContainer>
        <BRow>
            <BCol>
                <BFormInput v-model="filter" placeholder="Keresés" />
            </BCol>
        </BRow>
        <BTable :sort-by="[{ key: 'display_name', order: 'asc' }]" :sort-internal="true" :items="authorList" :fields="sortFields"
            :filter="filter" :per-page="perPage" :current-page="currentPage" @filtered="onFiltered" select-mode="single"
            ref="selectableTable" selectable @row-clicked="onRowClicked" />
        <BRow>
            <BCol>
                <BPagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" :align="'fill'" size="sm"
                    class="my-0" />
            </BCol>
        </BRow>
    </BContainer>
</template>
<script setup lang="ts">
import axios from 'axios';
import {
    BCol,
    BContainer,
    BFormInput,
    BPagination,
    BRow,
    BTable,
    type TableFieldRaw,
    type TableItem
} from 'bootstrap-vue-next';
import { ref } from 'vue';

interface AuthorListItem {
    display_name: string
    encoded: string
}
const authorList = ref([{}] as AuthorListItem[])
const currentPage = ref(1)
const totalRows = ref(100)
const perPage = ref(50)
const filter = ref('')

const sortFields: Exclude<TableFieldRaw<AuthorListItem>, string>[] = [
    { key: 'display_name', sortable: true, label: 'Név' },
]

async function fetchData() {
    try {
        window.location.href.startsWith('http://localhost') ? axios.defaults.baseURL = 'http://localhost:3000' : axios.defaults.baseURL = 'https://bartlbalazs.github.io/mekjatszo/'
        const authorListRespone = await axios.get<AuthorListItem[]>('/static/author_list.json')
        if (authorListRespone.data) {
            totalRows.value = authorListRespone.data.length;
            authorList.value = authorListRespone.data;
        }
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    fetchData()
})

function onFiltered(filteredItems: TableItem<AuthorListItem>[]) {
    totalRows.value = filteredItems.length
}

async function onRowClicked(item: TableItem<AuthorListItem>) {
    await navigateTo('/author/' + item.encoded)
}

</script>