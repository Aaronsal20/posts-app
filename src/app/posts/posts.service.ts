import { Post } from './post.model';

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment'

const BACKEND_URL =  environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[], postCount: number}>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, curremtPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${curremtPage}`;
    this.httpClient.get<{message: string, posts: any, maxPosts: number}>(
     BACKEND_URL + queryParams
      ).pipe(
        map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }), maxPosts: postData.maxPosts
      };
      }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts
      });
    });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{_id: string; title: string; content: string, imagePath: string, creator: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.httpClient.post<{message: string, post: Post}>(BACKEND_URL, postData)
    .subscribe((responseData) => {
      // tslint:disable-next-line: no-shadowed-variable
      // const post: Post = {
      //   id: responseData.post.id,
      //   title: title,
      //   content: content,
      //   imagePath: responseData.post.imagePath
      // }
      // const id = responseData.post.id;
      // post.id = id;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });

  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post;
    if (typeof(image) === 'object') {
      const postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("imagePath", image, title);
    } else {
       postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }

    this.httpClient
    .put(BACKEND_URL + id, postData)
    .subscribe(response => {
    // const updatedPosts = [...this.posts];
    // const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
    // const post: Post = {
    //   id: id,
    //   title: title,
    //   content: content,
    //   imagePath: ""
    // }
    // updatedPosts[oldPostIndex] = post;
    // this.posts = updatedPosts;
    // this.postsUpdated.next([...this.posts]);
    this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.httpClient.delete(BACKEND_URL + postId);
  }


}
