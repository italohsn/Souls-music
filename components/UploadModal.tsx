"use client"
 
import uniqid from "uniqid"
import { SubmitHandler,FieldValues,useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import useUploadModal from "@/hooks/useUploadModal";

import Modal from "./Modal"
import Input from "./Input";
import Button from "./Button";



const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const UploadModal = useUploadModal();
  const { user } = useUser()
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset
  } = useForm<FieldValues> ({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    }
  })

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      UploadModal.onClose();

    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true)

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Campos ausentes')
        return;
      }

      const uniqueID = uniqid();

      // Upload song

      const {
        data: songData,
        error: songError,
      } = await supabaseClient
        .storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueID}`, songFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (songError) {
        setIsLoading(false);
        return toast.error("Falha no upload da música")
      }

      // Upload image

      const {
        data: imageData,
        error: imageError,
      } = await supabaseClient
        .storage
        .from('images')
        .upload(`image-${values.title}-${uniqueID}`, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (imageError) {
        setIsLoading(false);
        return toast.error('Falha no upload da imagem')
      }  

      const {
        error: supabaseError
      } = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path
        });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message)
      }
      
      router.refresh();
      setIsLoading(false)
      toast.success('Música criada!');
      reset();
      UploadModal.onClose();

    } catch (error) {
      toast.error("Algo deu errado")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Adicione sua música"
      description="Carregar um arquivo mp3"
      isOpen={UploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', {required: true})}
          placeholder="Nome da Música"
        />
        <Input
          id="auhtor"
          disabled={isLoading}
          {...register('author', {required: true})}
          placeholder="Autor da Música"
        />
        <div>
          <div className="pb-1">
            Selecione um arquivo de Música
          </div>
          <Input
          id="song"
          type="file"
          disabled={isLoading}
          accept=".mp3"
          {...register('song', {required: true})}
        />
        </div>
        <div>
          <div className="pb-1">
            Selecione um arquivo de Imagem
          </div>
          <Input
          id="image"
          type="file"
          disabled={isLoading}
          accept="image/*"
          {...register('image', {required: true})}
        />
        </div>
        <Button disabled={isLoading} type="submit">
            Criar
        </Button>
      </form>
    </Modal>
  )
}

export default UploadModal;