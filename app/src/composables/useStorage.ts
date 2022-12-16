import { Storage, Drivers } from "@ionic/storage";
import { onMounted } from "vue";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";

export function useStorage() {
  let _storage: Storage;

  const getStorage = async (): Promise<Storage> => {
    if (_storage == null) {
      const store = new Storage({
        driverOrder: [
          CordovaSQLiteDriver._driver,
          Drivers.IndexedDB,
          Drivers.LocalStorage,
        ],
      });
      _storage = await store.create();
    }

    return new Promise((resolve) => resolve(_storage));
  };

  //   onMounted(initStorage);

  const set = async (key: string, value: any) => {
    console.log(value);
    (await getStorage()).set(key, value);
  };

  const get = async (key: string) => {
    return await (await getStorage()).get(key);
  };

  return {
    set,
    get,
  };
}
