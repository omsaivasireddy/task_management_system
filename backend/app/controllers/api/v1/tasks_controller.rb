module Api
    module V1
      class TasksController < ApplicationController
        before_action :set_task, only: [:show, :update, :destroy]
  
        def index
          tasks = current_user.tasks.includes(:subtasks)
          render json: tasks, include: :subtasks
        end
  
        def show
          render json: @task, include: :subtasks
        end
  
        def create
          task = current_user.tasks.build(task_params)
          if task.save
            render json: task, status: :created
          else
            render json: { errors: task.errors.full_messages }, 
                   status: :unprocessable_entity
          end
        end
  
        def update
          if @task.update(task_params)
            render json: @task
          else
            render json: { errors: @task.errors.full_messages }, 
                   status: :unprocessable_entity
          end
        end
  
        def destroy
          @task.destroy
          head :no_content
        end
  
        private
  
        def set_task
          @task = current_user.tasks.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Task not found' }, status: :not_found
        end
  
        def task_params
          params.require(:task).permit(:title, :description, :status, :due_date)
        end
      end
    end
  end