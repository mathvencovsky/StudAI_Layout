import {
  CollectionReference,
  DocumentReference,
  DocumentData,
  WithFieldValue,
} from "firebase/firestore";

declare module "firebase/firestore" {
  /**
   * aAdd a new document to specified `CollectionReference` with the given data,
   * assigning it a document ID automatically.
   *
   * @param reference - A reference to the collection to add this document to.
   * @param data - An Object containing the data for the new document.
   * @returns A `Promise` resolved with a `DocumentReference` pointing to the
   * newly created document after it has been written to the backend (Note that it
   * won't resolve while you're offline).
   */
  export declare function addDoc<
    AppModelType,
    DbModelType extends DocumentData,
  >(
    reference: CollectionReference<AppModelType, DbModelType>,
    data: WithFieldValue<NoInfer<AppModelType>>
  ): Promise<DocumentReference<AppModelType, DbModelType>>;
}
