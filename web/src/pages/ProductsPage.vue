<template>
<div class="flex flex-col gap-4 p-2">
    <div class="font-bold text-h1">Productos</div>
    <div class="flex w-full items-center py-2 justify-around rounded-lg border-2 border-accent
     px-4">
         <img :src="SearchIcon" alt="" class="size-5 shrink-0" />

         <input
           class="min-w-0 border-0 py-3 outline-none"
           type="search"
           placeholder="Aceite, huevos..."
           v-model="name"
           @keyup="debounce(()=>handleFiltersChange({...filters,q: name}))"
         />

    </div>
    <div class="flex justify-between">
        <div class="font-semibold">
               {{products?.length}} productos
        </div>
        <div class="flex justify-between">

            <select @change="handleFiltersChange({ ...filters, sort })" v-model="sort">
                <option v-for="option in PRODUCTS_SORT" :key="option" >{{option}}</option>
            </select>
        </div>
    </div>
    <div class="flex flex-col gap-2">
        <ProductCard v-for="product in products" :product="product" :key="product.id"/>
    </div>
</div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import SearchIcon from "../assets/SearchIcon.svg"
import ProductCard from "../components/ProductCard.vue";
import { useProducts } from "../api/useProducts";
import { PRODUCTS_SORT, type ProductsFilters } from "../enums/products";

const props = defineProps<{ q?: string }>()
const name = ref<string>(props.q ?? "")
const sort = ref<ProductsFilters['sort']>(PRODUCTS_SORT[0])
const debounceId = ref<ReturnType<typeof setTimeout> | null>(null)

const { getProducts, products, filters } = useProducts({ q: props.q ?? "" })

function handleFiltersChange(newFilters: ProductsFilters) {
  void getProducts(newFilters)
}

function debounce(callback: Function) {

  if (debounceId.value) clearTimeout(debounceId.value)
  debounceId.value = setTimeout(callback, 500)
}



</script>
