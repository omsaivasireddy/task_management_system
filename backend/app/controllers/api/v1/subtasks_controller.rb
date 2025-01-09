module Api
    module V1
      class SubtasksController < ApplicationController
        before_action :set_task
        before_action :set_subtask, only: [:show, :update, :destroy]
  
        def index
          render json: @task.subtasks
        end
  
        def show
          render json: @subtask
        end
  
        def create
          subtask = @task.subtasks.build(subtask_params)
          if subtask.save
            render json: subtask, status: :created
          else
            render json: { errors: subtask.errors.full_messages }, 
                   status: :unprocessable_entity
          end
        end
  
        def update
          if @subtask.update(subtask_params)
            render json: @subtask
          else
            render json: { errors: @subtask.errors.full_messages }, 
                   status: :unprocessable_entity
          end
        end
  
        def destroy
          @subtask.destroy
          head :no_content
        end
  
        private
  
        def set_task
          @task = current_user.tasks.find(params[:task_id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Task not found' }, status: :not_found
        end
  
        def set_subtask
          @subtask = @task.subtasks.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Subtask not found' }, status: :not_found
        end
  
        def subtask_params
          params.require(:subtask).permit(:title, :status)
        end
      end
    end
  end