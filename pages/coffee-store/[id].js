import { useRouter } from "next/router";
import Link from "next/link";
import CoffeeStoreData from '../../data/coffee-stores.json'
import Head from "next/head";
import Image from "next/image";

import useSWR from 'swr';

import styles from '../../styles/coffee-store.module.css'
import cls from "classnames";
//import { fetchCoffeeStores } from "@/lib/coffee-store";
import { fetchCoffeeStores } from "../../lib/coffee-store";
import {  useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "@/utils";
import { fetcher } from "@/lib/fetcher";


export async function getStaticProps(staticProps){
    const params = staticProps.params;
  
    const CoffeeStores = await fetchCoffeeStores();
   const findCoffeeStoreById =  CoffeeStores.find((CoffeeStore) =>{
    return CoffeeStore.id.toString() === params.id; //dynamic id
});
    return {
        props: {
            CoffeeStore : findCoffeeStoreById ? findCoffeeStoreById : {} ,
        },
    };
}

export async function getStaticPaths() {
    const CoffeeStores = await fetchCoffeeStores();
    const paths = CoffeeStores.map((CoffeeStore) => {
        return {
            params: {
                id: CoffeeStore.id.toString(),
            }
        }
    });

    return { paths,
         fallback: true,
    }
}

const CoffeeStore = (initialProps) =>{
    const router = useRouter();


    if (router.isFallback){
        return <div>Loading....</div>
    }



    const id = router.query.id;

    const [CoffeeStore, setCoffeeStore] = useState(initialProps.CoffeeStore)

    const {
        state: {
            CoffeeStores
        }
    } = useContext(StoreContext)

    const handleCreateCoffeeStore = async (CoffeeStore) => {
        try{
            const   { id, name, address, formatted_address, voting, imgUrl } = CoffeeStore;
            
            const response = await fetch('/api/createCoffeeStore', {
                method: "POST", // or 'PUT'
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id, 
                    name,
                    address: address || "",
                    formatted_address: formatted_address || "",
                    voting: 0,
                    imgUrl 
                }),
              });

              const dbCoffeeStore = await response.json();
           

        }catch (err){
            console.error('Error creating coffee store', err)
        }
    }

    useEffect(() =>{
        if(isEmpty(initialProps.CoffeeStore)){
            if (CoffeeStores.length > 0) {

                const CoffeeStoreFromContext =  CoffeeStores.find((CoffeeStore) => {
                    return CoffeeStore.id.toString() === id; //dynamic id
                });

                if (CoffeeStoreFromContext){

                    setCoffeeStore(CoffeeStoreFromContext);
                    handleCreateCoffeeStore(CoffeeStoreFromContext);
                }

  

            } else{
              //staticSSG
                handleCreateCoffeeStore(initialProps.CoffeeStore);
            }
        }
    }, [id, initialProps.CoffeeStore]);


    const {name, address , formatted_address, imgUrl} = CoffeeStore;

    const [votingCount, setVotingCount] = useState(0);

    const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

    useEffect(() => {
        if (data && data.length > 0) {
 
            setCoffeeStore(data[0]);

            setVotingCount(data[0].voting);
        }
    },[data]);
    
    const handleUpvoteButton = async () => {
    

        try{
            const response = await fetch('/api/favouriteCoffeeStoreById', {
                method: "PUT", // or 'PUT'
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id, 

                }),
              });

              const dbCoffeeStore = await response.json();
            

              if(dbCoffeeStore && dbCoffeeStore.length > 0){
                let count = votingCount + 1;
                setVotingCount(count);
              }

        }catch (err){
            console.error('Error upvoting the coffee store', err)
        }

    };

    if (error){
        return <div>Something went wrong retrieving coffee store page</div>
    }
    
    return (
    <div className={styles.layout}>
      
        <Head>
            <title>{name}</title>
      
      
          </Head>
  <div className={styles.container}>
   <div className={styles.col1}>
   <div className={styles.backToHomeLink}>
    <Link href ="/"> 
    Back To home   
      </Link> </div>

            <div className={styles.nameWrapper}>
                <h1 className={styles.name}>{name}</h1>
            </div>
            <Image src = {imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"} 
             width={600} 
             height={360}
              className={styles.storeImg} 
              alt = {name}>
              </Image>
    </div>

    <div className={cls("glass",styles.col2)}>
       {address && (
        <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width="24" height="24"/>
            <p className={styles.text}>{address}</p>
        </div>
        )}
        {formatted_address &&(
        <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width="24" height="24"/>
            
        <p className={styles.text}>{formatted_address}</ p>
        
        </div>
    )}
        <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24"/>
            <p className={styles.text}>{votingCount}</p>
        </div>
       <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up Vote!</button>
    </div>
    </div>

    </div>
    );
};

export default CoffeeStore;